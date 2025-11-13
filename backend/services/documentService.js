const Document = require('../models/Document');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

exports.uploadDocumentService = async (file, body, userId) => {
  if (!file) throw new Error('No file uploaded');
  if (!body.type) throw new Error('Document type is required');

  const uploadResult = await uploadToCloudinary(file.buffer);

  const document = new Document({
    userId,
    applicationId: body.applicationId || null,
    type: body.type,
    filename: uploadResult.original_filename,
    originalName: file.originalname,
    cloudinaryId: uploadResult.public_id,
    url: uploadResult.secure_url,
    size: uploadResult.bytes,
    mimeType: file.mimetype,
    description: body.description || ''
  });

  await document.save();
  return document;
};

exports.getDocumentsService = async (userId, query) => {
  const filter = { userId };
  if (query.type) filter.type = query.type;
  if (query.applicationId) filter.applicationId = query.applicationId;
  
  return await Document.find(filter).sort({ uploadedAt: -1 });
};

exports.getDocumentByIdService = async (userId, id) => {
  const document = await Document.findOne({ _id: id, userId });
  if (!document) throw new Error('Document not found');
  return document;
};

exports.updateDocumentService = async (userId, id, updateData) => {
  const document = await Document.findOneAndUpdate(
    { _id: id, userId },
    {
      ...(updateData.type && { type: updateData.type }),
      ...(updateData.description && { description: updateData.description }),
      ...(updateData.isPublic !== undefined && { isPublic: updateData.isPublic }),
      updatedAt: new Date()
    },
    { new: true, runValidators: true }
  );

  if (!document) throw new Error('Document not found');
  return document;
};

exports.deleteDocumentService = async (userId, id) => {
  const document = await Document.findOne({ _id: id, userId });
  if (!document) throw new Error('Document not found');

  await deleteFromCloudinary(document.cloudinaryId);
  await Document.findByIdAndDelete(id);
};
