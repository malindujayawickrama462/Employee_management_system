import Employee from "../models/employee.js";


export async function AddEmployee(req,res){
    try{
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json(employee);
    }catch(err){
        res.status(400).json({
            msg:err.message
        });
    }
};
export async function getEmployees(req,res) {
    try{
        const employess = await Employee.find()
        .populate("department", "departmentID name");
        if(!employess){
            return res.status(400).json({
                msg:"No employees"
            });
        }
        res.status(200).json(employess)
    }catch(err){
        res.status(500).json({
            msg:err.message
        });
    }
};

export async function getEmployeeByID(req,res){
    try{
        const employee = await Employee.findOne({employeeID:req.params.ID});
        if(!employee){
            return res.status(400).json({
                msg:"not found employee"
            })
        }
        res.status(201).json(employee);
    }catch(err){
        res.status(500).json({
            msg:err.message
        });
    };
};

export async function UpdateEmployee(req,res){
    try{
        const employee = await Employee.findOneAndUpdate({employeeID:req.params.ID},req.body,{new:true});
        res.json({
            msg:"update succesfully"
        });
    }catch(err){
        res.status(404).json({
            msg:err.message
        })
    }
};

export async function deleteEmployee(req,res){
    try{
        const employee = await Employee.findOneAndDelete({employeeID:req.params.ID});
        if(!employee){
            return res.status(400).json({
                msg:"Employee not found"
            });
        }
        res.status(201).json({
            msg:"Employee deleted successfully!"
        });
    }catch(err){
        res.status(500).json({
            msg:err.message
        });
    }
};
