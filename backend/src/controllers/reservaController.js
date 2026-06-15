const { Reserva, Sala, Usuario } = require('../../models');
const { Op } = require('sequelize');

exports.crearReserva = async (req, res) => {
  try {
    const { sala_id, fecha, hora_inicio, hora_fin } = req.body;
    const usuario_id = req.user.id;

    // Verificar conflicto
    const conflicto = await Reserva.findOne({
      where: {
        sala_id,
        fecha,
        estado: 'activa',
        [Op.or]: [
          { hora_inicio: { [Op.between]: [hora_inicio, hora_fin] } },
          { hora_fin: { [Op.between]: [hora_inicio, hora_fin] } },
          {
            [Op.and]: [
              { hora_inicio: { [Op.lte]: hora_inicio } },
              { hora_fin: { [Op.gte]: hora_fin } }
            ]
          }
        ]
      }
    });

    if (conflicto) {
      return res.status(409).json({ error: 'La sala ya está reservada en ese horario' });
    }

    const reserva = await Reserva.create({
      sala_id,
      usuario_id,
      fecha,
      hora_inicio,
      hora_fin,
      estado: 'activa'
    });

    res.status(201).json(reserva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listarReservasPorFecha = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) {
      return res.status(400).json({ error: 'Se requiere fecha' });
    }
    const reservas = await Reserva.findAll({
      where: { fecha, estado: 'activa' },
      include: [
        { model: Sala, attributes: ['nombre', 'capacidad'] },
        { model: Usuario, attributes: ['nombre', 'email'] }
      ],
      order: [['hora_inicio', 'ASC']]
    });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    if (reserva.usuario_id !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }
    reserva.estado = 'cancelada';
    await reserva.save();
    res.json({ message: 'Reserva cancelada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};