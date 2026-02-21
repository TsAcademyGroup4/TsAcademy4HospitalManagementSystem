import Ward from "./../db/models/Ward.model.js";

export const getAllAvailableBeds = async (req, res) => {
  try {
    const { wardType } = req.query;

    if (!wardType) {
      return res
        .status(400)
        .json({ success: false, message: "Ward Type is required" });
    }

    const wardTypeNormalized = wardType.trim().toUpperCase();

    const wards = await Ward.find({
      wardType: wardTypeNormalized,
      isActive: true,
    });

    const availableBedSpaces = [];

    for (const ward of wards) {
      const availableBeds = await ward.getAvailableBedsCount();
      if (availableBeds > 0) {
        availableBedSpaces.push({
          wardId: ward._id,
          name: ward.name,
          wardType: ward.wardType,
          availableBeds,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "List of available bed spaces",
      data: availableBedSpaces,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
