import FAQ from "../models/FAQ.js";

export const createFAQ = async (req, res, next) => {
  try {
    const newFAQ = new FAQ(req.body);
    const createdFAQ = await newFAQ.save();
    res.status(200).json({
      success: true,
      message: "FAQ created successfully",
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
      message: `FAQ with id ${req.params.is} has been edited successfully!!`,
      updatedFAQ,
    });
  } catch (err) {
    next(err);
  }
};

export const getFAQ = async (req, res, next) => {
  try {
    try {
      const FAQ = await FAQ.findById(req.params.id);
      res.status(200).json({ success: true, FAQ });
    } catch (err) {
      next(err);
    }
  } catch (error) {
    next(error);
  }
};

export const deleteFAQ = async (req, res, next) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "FAQ has been deleted!!" });
  } catch (err) {
    next(err);
  }
};

export const getFAQs = async (req, res, next) => {
  try {
    const FAQs = await FAQ.find();
    res.status(200).json(FAQs);
  } catch (err) {
    next(err);
  }
};
