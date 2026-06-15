const { Reserva, Sala, Usuario } = require('../../models');
const { Op } = require('sequelize');

exports.crearReserva = async (req, res) => {
  try {
    const { SalaId, fecha, hora_inicio, hora_fin } = req.body;
    const UsuarioId = req.user.id;

    // Verificar conflicto
    const conflicto = await Reserva.findOne({
      where: {
        SalaId,
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
      SalaId,
      UsuarioId,
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

exports.listarReservas = async (req, res) => {
  try {
    const { fecha } = req.query;
    const whereClause = { estado: 'activa' };
    if (fecha) {
      whereClause.fecha = fecha;
    }
    const reservas = await Reserva.findAll({
      where: whereClause,
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

exports.obtenerReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reserva.findByPk(id, {
      include: [
        { model: Sala, attributes: ['nombre', 'capacidad'] },
        { model: Usuario, attributes: ['nombre', 'email'] }
      ]
    });
    if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reserva.findByPk(id);
    if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });
    if (reserva.UsuarioId !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }
    await reserva.update(req.body);
    res.json(reserva);
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
    if (reserva.UsuarioId !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }
    reserva.estado = 'cancelada';
    await reserva.save();
    res.json({ message: 'Reserva cancelada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};