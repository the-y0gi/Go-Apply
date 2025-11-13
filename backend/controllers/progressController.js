const progressService = require("../services/progressService.js");

// GET → GLOBAL PROGRESS
exports.getGlobalProgress = async (req, res) => {
  try {
    const data = await progressService.calculateGlobalProgress(req.user._id);

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("Global progress error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET → APPLICATION-LEVEL PROGRESS
exports.getApplicationProgress = async (req, res) => {
  try {
    const data = await progressService.calculateApplicationProgress(
      req.user._id,
      req.params.id
    );

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("Application progress error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
