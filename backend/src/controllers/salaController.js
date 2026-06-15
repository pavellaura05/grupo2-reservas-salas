const { Sala, Reserva } = require('../../models');
const { Op } = require('sequelize');

exports.listarSalas = async (req, res) => {
  try {
    const salas = await Sala.findAll();
    res.json(salas);
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
        sala_id: id,
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