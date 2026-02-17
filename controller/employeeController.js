import Employee from "../models/employee.js";
import Department from "../models/department.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";


export async function AddEmployee(req, res) {
    try {
        const { name, email, password, role, employeeID } = req.body;

        // 1. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: "User with this email already exists" });
        }

        // 2. Check if employee record already exists
        const employeeExists = await Employee.findOne({ employeeID });
        if (employeeExists) {
            return res.status(400).json({ msg: "Employee with this ID already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create User account
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "employee"
        });

        // 4. Create Employee record
        const employeeData = { ...req.body };
        delete employeeData.password; // Don't store plain password in employee record

        // Handle empty fields to avoid Mongoose CastErrors
        if (employeeData.department === "") delete employeeData.department;
        if (employeeData.salary === "") delete employeeData.salary;
        if (employeeData.dob === "") delete employeeData.dob;
        if (employeeData.contractExpiry === "") delete employeeData.contractExpiry;


        const employee = new Employee(employeeData);
        await employee.save();

        // 5. Sync with Department model
        if (employee.department) {
            await Department.findByIdAndUpdate(employee.department, {
                $push: { employees: employee._id }
            });
        }

        res.status(201).json({ employee, user });
    } catch (err) {
        res.status(400).json({
            msg: err.message
        });
    }
};
export async function getEmployees(req, res) {
    try {
        const employess = await Employee.find()
            .populate("department", "departmentID name");
        if (!employess) {
            return res.status(400).json({
                msg: "No employees"
            });
        }
        res.status(200).json(employess)
    } catch (err) {
        res.status(500).json({
            msg: err.message
        });
    }
};

export async function getEmployeeByID(req, res) {
    try {
        const employee = await Employee.findOne({ employeeID: req.params.ID });
        if (!employee) {
            return res.status(400).json({
                msg: "not found employee"
            })
        }
        res.status(201).json(employee);
    } catch (err) {
        res.status(500).json({
            msg: err.message
        });
    };
};

export async function UpdateEmployee(req, res) {
    try {
        const { ID } = req.params;
        const oldEmployee = await Employee.findOne({ employeeID: ID });

        if (!oldEmployee) {
            return res.status(404).json({ msg: "Employee not found" });
        }

        const updateData = { ...req.body };
        if (updateData.department === "") updateData.department = null;
        if (updateData.salary === "") delete updateData.salary;
        if (updateData.dob === "") updateData.dob = null;
        if (updateData.contractExpiry === "") updateData.contractExpiry = null;


        const updatedEmployee = await Employee.findOneAndUpdate(
            { employeeID: ID },
            updateData,
            { new: true }
        );

        // Update User account if email changed
        if (req.body.email && oldEmployee.email !== req.body.email) {
            await User.findOneAndUpdate(
                { email: oldEmployee.email },
                { email: req.body.email, name: req.body.name || oldEmployee.name }
            );
        } else if (req.body.name && oldEmployee.name !== req.body.name) {
            await User.findOneAndUpdate(
                { email: oldEmployee.email },
                { name: req.body.name }
            );
        }

        // Handle department change sync
        if (req.body.department && oldEmployee.department?.toString() !== req.body.department.toString()) {
            // Remove from old department
            if (oldEmployee.department) {
                await Department.findByIdAndUpdate(oldEmployee.department, {
                    $pull: { employees: oldEmployee._id }
                });
            }
            // Add to new department
            await Department.findByIdAndUpdate(req.body.department, {
                $push: { employees: updatedEmployee._id }
            });
        }

        res.json({
            msg: "update succesfully",
            employee: updatedEmployee
        });
    } catch (err) {
        res.status(404).json({
            msg: err.message
        })
    }
};

export async function deleteEmployee(req, res) {
    try {
        const { ID } = req.params;
        const employee = await Employee.findOne({ employeeID: ID });

        if (!employee) {
            return res.status(400).json({
                msg: "Employee not found"
            });
        }

        // Remove from department's employees list
        if (employee.department) {
            await Department.findByIdAndUpdate(employee.department, {
                $pull: { employees: employee._id }
            });
        }

        // Delete associated User account
        await User.findOneAndDelete({ email: employee.email });

        await Employee.deleteOne({ employeeID: ID });

        res.status(201).json({
            msg: "Employee deleted successfully!"
        });
    } catch (err) {
        res.status(500).json({
            msg: err.message
        });
    }
};

export async function getMe(req, res) {
    try {
        const employee = await Employee.findOne({ email: req.user.email })
            .populate("department", "name");
        if (!employee) {
            return res.status(404).json({ msg: "Employee record not found" });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

export async function updateMe(req, res) {
    try {
        const { address, email, name } = req.body;
        const employee = await Employee.findOne({ email: req.user.email });

        if (!employee) {
            return res.status(404).json({ msg: "Employee record not found" });
        }

        // Update name and email in User model too
        if (name) employee.name = name;
        if (address) employee.address = address;

        if (email && email !== employee.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ msg: "Email already in use" });
            }
            await User.findOneAndUpdate({ email: employee.email }, { email, name: name || employee.name });
            employee.email = email;
        } else if (name && name !== employee.name) {
            await User.findOneAndUpdate({ email: employee.email }, { name });
        }

        await employee.save();
        res.status(200).json({ msg: "Profile updated successfully", employee });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}
