import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

const App = ({ image }) => {
  const cld = new Cloudinary({ cloud: { cloudName: 'dkuddiipk' } });

  // Create the transformed image URL
  const img = cld
    .image(image) // Use the passed `image` prop
    .format('auto') // Optimize delivery by resizing and applying auto-format and auto-quality
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image
  
  const imageUrl = img.toURL(); // Generate the URL of the transformed image

  return (
    <div>
      <p>Transformed Image URL:</p>
      <a href={imageUrl} target="_blank" rel="noopener noreferrer">
        {imageUrl}
      </a>
    </div>
  );
};

export default App;
