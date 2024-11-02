let requestCount = 0;

const express = require("express");
const multer = require("multer");

const Pet = require("../model/petSchema");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// checks the total number of requests received
// router.use((req, res, next) => {
//   requestCount++;
//   console.log(`Total requests received: ${requestCount}`);
//   next();
// });

// Route to get all pets
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find();
    if (!pets.length) {
      return res.status(404).json({ message: "No pets found" });
    }
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get pets by query
router.get("/pets", async (req, res) => {
  try {
    const { location, animal, breed } = req.query;
    const query = {};
    if (location) query.location = { $regex: location, $options: "i" };
    if (animal) query.animal = { $regex: animal, $options: "i" };
    if (breed) query.breed = { $regex: breed, $options: "i" };

    const pets = await Pet.find(query);
    if (!pets.length) {
      return res.status(404).json({ message: "No pets found" });
    }

    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get animals list
router.get("/pets/animals", async (req, res) => {
  try {
    const animals = await Pet.find()
      .where("animal")
      .ne(null)
      .distinct("animal");
    if (!animals.length) {
      return res.status(404).json({ message: "No animals found" });
    }

    // sorting the animals list
    animals = animals.map((animal) => animal.toLowerCase());
    animals.sort();

    // Capitalizing the first letter of each animal
    animals = animals.map(
      (animal) => animal.charAt(0).toUpperCase() + animal.slice(1)
    );

    // Sending the animals list
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get breeds list
router.get("/pets/breeds", async (req, res) => {
  try {
    const { animal } = req.query;

    if (!animal) {
      return res.status(400).json({ message: "Animal is required" });
    }

    const breeds = await Pet.find({ animal })
      .select({ breed: 1, _id: 0 })
      .distinct("breed");

    if (!breeds.length) {
      return res.status(404).json({ message: "No breeds found" });
    }
    // sorting the breeds list
    breeds = breeds.map((breed) => breed.toLowerCase());
    breeds.sort();

    // Capitalizing the first letter of each breed
    breeds = breeds.map(
      (breed) => breed.charAt(0).toUpperCase() + breed.slice(1)
    );

    // Sending the breeds list
    res.json(breeds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get pet by id
router.get("/pets/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      res.status(404).json({ message: "Pet not found" });
    }
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a pet
router.post("/add-pet", upload.array("images"), async (req, res) => {
  const { name, location, animal, breed } = req.body;
  const images = req.files.map((file) => file.path);

  if (!name || !location || !animal || !breed || !images.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const trimmedFields = { name, location, animal, breed };
  Object.keys(trimmedFields).forEach((key) => {
    trimmedFields[key] = trimmedFields[key].trim();
  });

  const newPet = new Pet({
    ...trimmedFields,
    images,
  });

  try {
    const pet = await newPet.save();
    res.status(201).json(pet);
    console.log("Pet added successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;