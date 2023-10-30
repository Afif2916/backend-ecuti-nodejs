import Cuti from "../models/CutiModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";

export const getCuti = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "supervisor") {
      response = await Cuti.findAll({
        include: [
          {
            model: Users,
            attributes: ["name", "email", "jatah_cuti"],
          },
        ],
      });
    } else {
      response = await Cuti.findAll({
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email", "jatah_cuti"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCutiSupervisorAdmin = async (req, res) => {
  try {
    let response;
    if (req.role === "admin" || req.role === "supervisor") {
      response = await Cuti.findAll({
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email", "jatah_cuti"],
          },
        ],
      });
      res.status(200).json(response);
    } else {
      res.status(403).json({ msg: "Akses terlarang" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCutiAdminOnly = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Cuti.findAll({
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email", "jatah_cuti"],
          },
        ],
      });
      res.status(200).json(response);
    } else {
      res.status(403).json({ msg: "Akses Terlarang" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCutibyid = async (req, res) => {
  try {
    const cuti = await Cuti.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!cuti) return res.status(404).json({ msg: "Data Cuti tidak ditemukan" });
    let response;
    if (req.role === "admin" || req.role === "supervisor") {
      response = await Cuti.findOne({
        where: {
          id: cuti.id,
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email", "jatah_cuti"],
          },
        ],
      });
    } else {
      response = await Cuti.findOne({
        where: {
          [Op.and]: [{ id: cuti.id }, { userId: req.userId }],
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email", "jatah_cuti"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createCuti = async (req, res) => {
  const { tanggal_awal, tanggal_akhir, total_hari, alasan_cuti, approval } = req.body;
  try {
    await Cuti.create({
      tanggal_awal: tanggal_awal,
      tanggal_akhir: tanggal_akhir,
      total_hari: total_hari,
      alasan_cuti: alasan_cuti,
      approval: approval,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Pengajuan Cuti berhasil Di buat" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ msg: error });
  }
};

export const approvalCuti = async (req, res) => {
  try {
    const cuti = await Cuti.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!cuti) return res.status(404).json({ msg: "Data Cuti tidak Ditemukan" });
    const { approval } = req.body;
    if (req.role === "supervisor") {
      await Cuti.update(
        { approval },
        {
          where: {
            id: cuti.id,
          },
        }
      );

      if (approval === "Disetujui") {
        let jatahCutiUser = await Users.findOne({
          where: {
            id: cuti.userId,
          },
        });

        if (jatahCutiUser && jatahCutiUser.jatah_cuti !== 0) {
          const jatahCutiUserNew = jatahCutiUser.jatah_cuti - cuti.total_hari;

          await Users.update(
            {
              jatah_cuti: jatahCutiUserNew,
            },
            {
              where: {
                id: cuti.userId,
              },
            }
          );
        } else {
          return res.status(200).json({ msg: "Jatah Cuti Habis" });
        }
        return res.status(200).json({ msg: "Cuti Disetujui" });
      } else if (approval === "Tidak Disetujui") {
        return res.status(200).json({ msg: "Cuti tidak disetujui" });
      } else {
        return res.status(400).json({ msg: "Pilihan 'approval' tidak valid" });
      }
    } else {
      return res.status(403).json({ msg: "Akses Terlarang" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateCuti = async (req, res) => {
  try {
    const cuti = await Cuti.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!cuti) return res.status(404).json({ msg: "Data Cuti tidak ditemukan" });
    const { tanggal_awal, tanggal_akhir, total_hari, alasan_cuti } = req.body;
    if (req.role === "admin" || req.role === "supervisor") {
      await Cuti.update(
        { tanggal_awal, tanggal_akhir, total_hari, alasan_cuti },
        {
          where: {
            id: cuti.id,
          },
        }
      );
    } else {
      if (req.userId !== cuti.userId) return res.status(403).json({ msg: "Akses terlarang" });
      await Cuti.update(
        { tanggal_awal, tanggal_akhir, total_hari, alasan_cuti },
        {
          where: {
            [Op.and]: [{ id: cuti.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Data Cuti Berhasil Diubah" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteCuti = async (req, res) => {
  try {
    const cuti = await Cuti.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!cuti) return res.status(404).json({ msg: "Data Cuti tidak ditemukan" });
    const { tanggal_awal, tanggal_akhir, total_hari, alasan_cuti } = req.body;
    if (req.role === "admin" || req.role === "supervisor") {
      await Cuti.destroy({
        where: {
          id: cuti.id,
        },
      });
    } else {
      if (req.userId !== cuti.userId) return res.status(403).json({ msg: "Akses terlarang" });
      await Cuti.destroy({
        where: {
          [Op.and]: [{ id: cuti.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Data Cuti Berhasil Dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
