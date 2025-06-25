import Contact from '../models/contact.js';

export const createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create({ ...req.body, owner: req.user.id });
    res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
};

export const getContacts = async (req, res, next) => {
  const { search, tag, sortBy } = req.query;
  const query = {
    $or: [
      { owner: req.user.id },
      { sharedWith: { $elemMatch: { user: req.user.id } } }
    ]
  };

  if (search) {
    query.$and = [
      {
        $or: [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { phone: new RegExp(search, 'i') }
        ]
      }
    ];
  }
  if (tag) query.tags = tag;

  try {
    const contacts = await Contact.find(query).sort(sortBy || 'createdAt');
    res.json(contacts);
  } catch (err) {
    next(err);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    const hasAccess =
      contact.owner.toString() === req.user.id ||
      contact.sharedWith.some(sw => sw.user.toString() === req.user.id);

    if (!contact || !hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(contact);
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!contact) {
      return res.status(403).json({ message: 'Not found or not authorized' });
    }
    res.json(contact);
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const result = await Contact.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id
    });
    if (!result) {
      return res.status(403).json({ message: 'Not found or not authorized' });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

export const shareContact = async (req, res, next) => {
  const { userId, access } = req.body;
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    contact.sharedWith.push({ user: userId, access });
    await contact.save();

    res.json({ message: 'Contact shared' });
  } catch (err) {
    next(err);
  }
};
