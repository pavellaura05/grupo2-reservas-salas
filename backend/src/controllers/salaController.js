const { Sala, Reserva } = require('../../models');
const { Op } = require('sequelize');

exports.listarSalas = async (req, res) => {
  try {
    const salas = await Sala.findAll({ order: [['id', 'ASC']] });
    res.json(salas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerSala = async (req, res) => {
  try {
    const sala = await Sala.findByPk(req.params.id);
    if (!sala) return res.status(404).json({ error: 'Sala no encontrada' });
    res.json(sala);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearSala = async (req, res) => {
  try {
    const sala = await Sala.create(req.body);
    res.status(201).json(sala);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarSala = async (req, res) => {
  try {
    const sala = await Sala.findByPk(req.params.id);
    if (!sala) return res.status(404).json({ error: 'Sala no encontrada' });
    await sala.update(req.body);
    res.json(sala);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarSala = async (req, res) => {
  try {
    const sala = await Sala.findByPk(req.params.id);
    if (!sala) return res.status(404).json({ error: 'Sala no encontrada' });
    await sala.destroy();
    res.json({ message: 'Sala eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verificarDisponibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora_inicio, hora_fin } = req.query;
    if (!fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({ error: 'Faltan parámetros de fecha/hora' });
    }
    const conflicto = await Reserva.findOne({
      where: {
        SalaId: id,
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
    res.json({ disponible: !conflicto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};