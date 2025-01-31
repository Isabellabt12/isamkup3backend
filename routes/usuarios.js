const express = require('express');
const router = express.Router();
const { MakeGetUsers, MakeCreateUser, MakeUpdateUser, MakeDeleteUSer, Makegetlogin } = require('../controllers/user-controller');
const httpStatus = require('../constants/http-constants');

const createRouter = ({ Usuario, UserRepository }) => {
    // Crear usuario
    router.post('/', async (req, res) => {
        const { nombre, email, password } = req.body;
        try {
            const userRepository = new UserRepository({ userModel: Usuario });
            const createUser = MakeCreateUser(userRepository);
            const usuario = await createUser({ nombre, email, password });
            res.json(usuario);
        } catch (error) {
            console.error('error:', error)
            return res.status(error.status || httpStatus.SERVER_ERROR).json(error);
        }
    });

    // Obtener todos los usuarios
    router.get('/', async (req, res) => {
        try {

            const userRepository = new UserRepository({ userModel: Usuario });
            const getUsers = MakeGetUsers(userRepository);
            const usuarios = await getUsers();
            res.json(usuarios);
        } catch (error) {
            console.error('getUsers-error:', error);
            return res.status(error.status || httpStatus.SERVER_ERROR).json(error);
        }
    });

    // // Actualizar usuario
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { nombre, email } = req.body;
        try {
            const userRepository = new UserRepository({ userModel: Usuario });
            const updateUser = MakeUpdateUser(userRepository);
            await updateUser({ id, nombre, email });
            res.json({ mensaje: 'Usuario actualizado' });
        } catch (error) {
            return res.status(error.status || httpStatus.SERVER_ERROR).json(error);
        }
    });

    // // Eliminar usuario
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const userRepository = new UserRepository({ userModel: Usuario });
            const deleteUser = MakeDeleteUSer(userRepository);
            await deleteUser(id);
            res.json({ mensaje: 'Usuario eliminado' });
        } catch (error) {
            return res.status(error.status || httpStatus.SERVER_ERROR).json(error);
        }
    });
    
    //login
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            const userRepository = new UserRepository({ userModel: Usuario });
            const getlogin = Makegetlogin(userRepository);
            const usuario = await getlogin({ email, password });
            if (usuario.length===1){
                res.json(usuario[0]);
            }
            else{
                throw Error('Usuario y contraseña incorrectas')
            }
        } catch (error) {
            console.error('error:', error)
            return res.status(error.status || httpStatus.SERVER_ERROR).json(error);
        }
    });

    return router;
}
module.exports = createRouter;