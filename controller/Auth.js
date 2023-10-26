import Users from "../models/UserModel.js";
import argon2 from "argon2"

export const Login  = async (req, res) => {
    const user = await Users.findOne({
        where: {
            email: req.body.email
        }
    })
    if(!user) return res.status(404).json({msg: "User tidak Ditemukan"})

    const match = await argon2.verify(user.password, req.body.password)
    if (!match) return res.status(400).json({msg: "Password Salah "})
    req.session.userId = user.uuid
    const uuid = user.uuid
    const name = user.name
    const email = user.email
    const role = user.role
    const jatah_cuti = user.jatah_cuti
    res.status(200).json({uuid, name, email, role, jatah_cuti})
}

export const Me = async (req, res) => {
    if(!req.session.userId) {
        return res.status(401).json({msg: "Mohon login ke akun anda"})
    }
    const user = await Users.findOne({
        attributes:['uuid', 'name', 'email', 'role', 'jatah_cuti'],
        where: {
            uuid: req.session.userId
        }
    })
    if(!user) return res.status(404).json ({msg: "User tidak ditemukan"})
    res.status(200).json(user)
}


export const logOut  = (req,res) => {
    req.session.destroy((err) => {
        if(err) return res.status(400).json({msg: "Tidak Dapat logout"})
        res.status(200).json({msg: "Anda telah logout"})
    })
}