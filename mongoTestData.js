'use strict';

import mongoose from 'mongoose';
import data from './server/data/dino.json';
import Dinosaur from './server/data/models/dinosaur';

mongoose.connect('mongodb://127.0.0.1:27017/test', () => {
  Dinosaur.find().count((err, count) => {
    // Only insert test data if count is 0
    if (count === 0) {
      const promise = new Promise((resolve) => {
        const length = data.length;

        data.forEach((item, index) => {
          const dino = new Dinosaur(item);
          let indexcounter = index + 1;

          dino.save((dinoErr) => {
            if (dinoErr) {
              console.log(dinoErr);
            }

            if (length === indexcounter) {
              resolve();
            }
          });
        });
      });

      promise.then(() => {
        console.log('Successfully saved disconnecting...');
        mongoose.disconnect();
      });
    } else {
      console.log('Test data already exsit disconnecting...');
      mongoose.disconnect();
    }
  });
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
