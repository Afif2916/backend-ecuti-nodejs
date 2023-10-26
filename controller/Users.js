import { response } from "express"
import Users from "../models/UserModel.js"
import argon2 from "argon2"
import { where } from "sequelize"


export const getUsers = async (req, res) => {
    try {
        const response = await Users.findAll({
            attributes:['uuid', 'name', 'email', 'jatah_cuti', 'role']
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }

}

export const getUsersbyid = async (req, res) => {
    try {
        const response = await Users.findOne({
            attributes:['uuid', 'name', 'email', 'jatah_cuti', 'role'],
            where: {
                uuid: req.params.id
            }
        }
        )
        res.status(200).send(response)
    } catch (error) {
        res.status(500).send({msg: error.message})
    }
}

export const createUser = async (req, res) => {
    const {name, email, password, confPassword, role, jatah_cuti} = req.body; 
    
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const existingUser = await Users.findOne({
        where: {
            email: email
        }
    });

    if (existingUser) {
        return res.status(400).json({ msg: "Email sudah terdaftar" });
    }
    const hashPassword = await argon2.hash(password);
    
    try{
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role,
            jatah_cuti: jatah_cuti
        })
        res.status(201).send({msg: "Register berhasil"})
        } catch (error) {
        res.status(400).send({msg: error.message})
        }
    
    
}

export const updateUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User Tidak Ditemukan"})
    const {name, email, password, confPassword, role, jatah_cuti} = req.body; 
    let hashPassword
    if(password === "" || password === null) {
        hashPassword = user.password
    } else {
        hashPassword = await argon2.hash(password)
    }
    if(password !== confPassword) return res.status(400).send({msg: "password dan confirm password tidak cocok"});
    try{
        await Users.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role,
            jatah_cuti: jatah_cuti
        }, {
            where: {
                id: user.id
            }
        })
        res.status(200).send({msg: "User Updated!"})
    } catch (error) {
        res.status(400).send({msg: error.message})
    }
}

export const deleteUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    try {
        await Users.destroy({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}


