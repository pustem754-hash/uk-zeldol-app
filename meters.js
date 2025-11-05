const express = require('express');
const router = express.Router();

// Получить список счетчиков пользователя
router.get('/list', async (req, res) => {
  try {
    // TODO: Получить список счетчиков из Supabase
    
    res.json({ 
      success: true,
      meters: [] 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Подать показания счетчика
router.post('/submit', async (req, res) => {
  try {
    const { meter_id, reading, photo_url } = req.body;
    
    // TODO: Сохранить показания в Supabase
    
    res.json({ 
      success: true,
      message: 'Показания сохранены' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

module.exports = router;

















