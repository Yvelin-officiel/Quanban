import Foo from '../models/foo.model.js';

export const getAllFoos = async (req, res) => {
  const foos = await Foo.find();
  res.json(foos);
};

export const getFooById = async (req, res) => {
  const foo = await Foo.findById(req.params.id);
  if (!foo) return res.status(404).json({ error: 'Foo not found' });
  res.json(foo);
};

export const createFoo = async (req, res) => {
  const newFoo = new Foo({ name: req.body.name });
  await newFoo.save();
  res.status(201).json(newFoo);
};

export const updateFoo = async (req, res) => {
  const updatedFoo = await Foo.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!updatedFoo) return res.status(404).json({ error: 'Foo not found' });
  res.json(updatedFoo);
};

export const deleteFoo = async (req, res) => {
  const deleted = await Foo.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Foo not found' });
  res.status(204).send();
};
