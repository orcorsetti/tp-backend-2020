const Role = require('../models/role'); //Requiero modelo 
const User = require('../models/user');
const ApiError = require('../error/ApiError');
const user = require('../models/user');

const RoleCtrl = {}; //Creo el objeto controlador

//Controla dependencias
RoleCtrl.checkDependencies = async(id) => {
    let query = await user.find({ roles: id });
    if (query.length > 0) {}
}

//Controla que estén todos los campos
RoleCtrl.checkCampos = async(name, desc, per) => {
        if (name.name != null || desc.description != null || per.permissions != null) {}
    }
    //Controla nombre repetido
RoleCtrl.checkName = async(name) => {
    let roles = await Role.find({ name: name })
    if (roles.length > 0) {}
}

//Metodo GetAll (res= response y req= request)
RoleCtrl.getRoles = async(req, res, next) => {
    try {
        const roles = await Role.find(); //Busca todos los documentos
        res.json(roles); //Los envio en formato JSON
    } catch (err) {
        res.status(500).send({ error: "Algo salió mal." });
    }
}

//Metodo Create
RoleCtrl.createRole = async(req, res, next) => {
    try {
        const role = new Role({ //Creo el nuevo rol con los parametros enviados en el request (sin ID porque lo da la BD)
            name: req.body.name,
            description: req.body.description,
            permissions: req.body.permissions
        });
        await RoleCtrl.checkName(role.name)
        await RoleCtrl.checkCampos(role.name, role.description, role.permissions)
        await role.save();
        res.json({ status: 'Rol Guardado Correctamente' }); //Guardo en la BD (y espero que finalice)

    } catch (err) {
        res.status(403).json({ error: 'Error al actualizar rol. Verifique que el nombre no se encuentre repetido o que no falte completar algun campo' })
    }
}

//Metodo GetOne
RoleCtrl.getRole = async(req, res, next) => {
    try {
        const { id } = req.params; //Consigo el ID mando por parametro en el get
        const role = await Role.findById(id); //Busco por ID
        res.json(role); //Lo envío
    } catch (err) {
        res.status(404).json({ error: 'Objeto no encontrado.' })
    }
}

//Metodo Update
RoleCtrl.updateRole = async(req, res, next) => {
    try {
        const { id } = req.params;
        const newRole = {
            name: req.body.name,
            description: req.body.description,
            permissions: req.body.permissions
        }
        await RoleCtrl.checkName(newRole.name)
        await RoleCtrl.checkCampos(newRole.name, newRole.description, newRole.permissions)
        await Role.findByIdAndUpdate(id, { $set: newRole });
        res.json({ status: 'Rol Actualizado Correctamente' });
    } catch (err) {
        res.status(403).json({ error: 'Error al actualizar rol. Verifique que el nombre no se encuentre repetido o que no falte completar algun campo' })
    }
}

//Metodo Delete
RoleCtrl.deleteRole = async(req, res, next) => {
    try {
        const { id } = req.params;
        await RoleCtrl.checkDependencies(id)
        await Role.findByIdAndRemove(id);
        res.json({ status: 'Rol Eliminado Correctamente' });
    } catch (err) {
        res.status(500).send({ error: "El rol que desea eliminar se encuentra vinculado a algún usuario, revise la dependencia." });
    }
}

//Exporto el controlador para requerirlo en otro lado
module.exports = RoleCtrl;