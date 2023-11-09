import FAQ from "../models/FAQ";

export const createFAQ = async (req, res, next) => {
  try {
    const newFAQ = new FAQ(req.body);
    const createdFAQ = await newFAQ.save();
    res.status(200).json({
      success: true,
      message: "Review created successfully!",
      createdFAQ,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFAQ = async (req, res, next) => {
  try {
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "FAQ updated successfully!",
      updatedFAQ,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFAQ = async (req, res, next) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({
        success: true,
        message: `FAQ with the id ${req.params.id} has been deleted!!`,
      });
  } catch (err) {
    next(err);
  }
};

export const getFAQ = async (req, res, next) => {
  try {
    const FAQ = await FAQ.findById(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Retreival successful", FAQ });
  } catch (err) {
    next(err);
  }
};

export const getFAQs = async (req, res, next) => {
  try {
    const FAQS = await FAQ.find();
    res
      .status(200)
      .json({ success: true, message: "Retreival successful", FAQS });
  } catch (err) {
    next(err);
  }
};
