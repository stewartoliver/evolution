// app/javascript/components/HelloWorld.jsx
import React from 'react';
import { TypeAnimation } from 'react-type-animation';

const HelloWorld = () => (
  <TypeAnimation
    cursor={true}
    sequence={[
      'Transform Your Life.',
      2000, // Wait 1 second
      '',
      500, // Wait 1 second
      'Achieve Your Fitness Goals.',
      2000, // Wait 1 second
      '',
      500, // Wait another second
      'Join Evolve Today.',
      2000, // Wait another second
    ]}
    wrapper="div"
    repeat={Infinity}
  />
);

export default HelloWorld;
