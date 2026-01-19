import Department from "../models/department.js";
import Employee from "../models/employee.js";

export async function addDepartment(req,res){
    try{
        const{departmentID,name,manager,employees} = req.body;
        if(!departmentID || !name ){
            return res.status(400).json({
                msg:"required all fields"
            });
        }
        const department = await Department.create({
            departmentID,
            name,
            manager,
            employees
        })
      res.status(201).json(department);  

    }catch(err){
        res.status(400).json({
            msg:err.message
        });
    }
};
 export async function assignManager(req,res) {
    try{
        const {departmentID,managerID}=req.body;
        if (!departmentID || !managerID) {
            return res.status(400).json({ msg: "departmentId and managerId are required" });
        }
        
        const department = await Department.findOne({departmentID}).populate("employees");
        if(!department){
            return res.status(404).json({
                msg:"department not found"
            });
        }
        const employee = await Employee.findOne({employeeID:managerID});
        if(!employee){
            return res.status(400).json({
                msg:"employee not found"
            });
        }
        const isEmployeeInDept = department.employees.some(
            emp=>emp._id.toString() == employee._id.toString()
        );
        if(!isEmployeeInDept){
            return res.status(400).json({
                msg:"manager must be an employees in this department first"
            });
        }else{
            department.manager=employee._id;
            await department.save();
            await department.populate("manager","employeeID name position");
            res.status(201).json({
                msg:"manager assigned successfully",
                department
            });
        }
    }catch(err){
        res.status(400).json({
            msg:err.message
        });
    }
 };

 export async function removeManager(req,res) {
   try{
        const{departmentID}=req.body;
        if(!departmentID){
            return res.status(400).json({
                msg:"departmentID required"
            });
        }
        const department = await Department.findOneAndUpdate({departmentID: departmentID},{manager:null},{new:true});
        if(!department){
            return res.status(400).json({
                msg:"department not found"
            })
        }else{
            res.status(201).json({
                msg:"manager removed successfully",department
            });
        }
   }catch(err){
        res.status(500).json({
            msg:err.message
        });
   }
 };

 export async function addEmployeeToDepartment(req,res){
    try{
        const{departmentID,employeeID} = req.body;
        if(!departmentID||!employeeID){
            return res.status(400).json({
                msg:"required departmentID and employeeID"
            });
        }
        const department = await Department.findOne({departmentID});
        if(!department){
            return res.status(400).json({
                msg:"department not found"
            });
        }
        const employee = await Employee.findOne({employeeID});
        if(!employee){
            return res.status(400).json({
                msg:"employee not found"
            });
        }
        if(department.employees.includes(employee._id)){
            return res.status(400).json({
                msg:"Employee already in this department"
            });
        }
        department.employees.push(employee._id);
        await department.save();
        employee.department = department._id;
        await employee.save();
        res.status(201).json({
            msg:"Employee added successfully",department
        });

    }catch(err){
        res.status(500).json({
            msg:err.message
        });
    }
 };

 export async function getEmployeesByDepartment(req,res) {
    try{
        const{departmentID} = req.body; 
        const department = await Department.findOne({departmentID})
        .populate("manager","employeeID name position")
        .populate("employees","employeeID name position salary");

        if(!department){
            return res.status(400).json({
                msg:"department not found"
            });
        }
        res.status(201).json({
            departmentID:department.departmentID,
            name:department.name,
            manager:department.manager,
            totalEmployees:department.employees.length,
            employees:department.employees
        });
    }catch(err){
        res.status(500).json({
            msg:err.message
        });
    }
 };
 export async function transferEmployee(req,res){
    try{
        const{employeeID,newDepartmentID}=req.body;
        if(!employeeID||!newDepartmentID){
            return res.status(400).json({
                msg:"required all fields"
            });
        }
        const employee = await Employee.findOne({employeeID});
        if(!employee){
            return res.status(400).json({
                msg:"employee not found"
            });
        }
        const newDept = await Department.findOne({departmentID:newDepartmentID});
        if(!newDept){
            return res.status(400).json({
                msg:"New Department not found"
            });
        }
        let oldDept = null;
        if(employee.department){
            oldDept = await Department.findById(employee.department);
            if(oldDept){
                oldDept.employees = oldDept.employees.filter(empId=>empId.toString() !== employee._id.toString());
                await oldDept.save();
            }
        }
        if(!newDept.employees.includes(employee._id)){
            newDept.employees.push(employee._id);
            await newDept.save();
        }
        employee.department = newDept._id;
        await employee.save();
        res.status(200).json({
            msg:"Employee transfered successfully",
            employee:{
                employeeID: employee.employeeID,
                name: employee.name,
                position: employee.position,
                department: {
                    departmentID: newDept.departmentID,
                    name: newDept.name
                }
            }
        });
    }catch(err){
        res.status(500).json({
            msg:err.message
        });
    }
 }; 