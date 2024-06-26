import { Button } from 'react-bootstrap';

import React, { useState, useEffect } from 'react';

const FetchPortfolio = () => {
    const [images, setImages] = useState([]);
    const [imageData, setImageData] = useState({
        filename: '',
        size: 0,
        type: '',
        location: ''
    });

    const handleInputChange = (e) => {
        setImageData({
            ...imageData,
            [e.target.name]: e.target.value
        });
    };

    const createImage = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/images/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(imageData)
            });
            const data = await response.json();
            getAllImages(); // Refresh the image list
        } catch (error) {
            console.error('Error creating image:', error);
        }
    };

    const getAllImages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/images', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setImages(data);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const getImageById = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/images/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
        } catch (error) {
            console.error('Error fetching image by ID:', error);
        }
    };

    const updateImage = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/images/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(imageData)
            });
            const data = await response.json();
            getAllImages(); // Refresh the image list
        } catch (error) {
            console.error('Error updating image:', error);
        }
    };

    const deleteImage = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/images/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 204) {
                getAllImages(); // Refresh the image list
            } else {
                console.error('Error deleting image:', response.status);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    useEffect(() => {
        getAllImages();
    }, []);

    return (
        <div className="graylogo col-md-9 mx-auto rounded mt-5 p-5" >
            <h1 className="mx-auto rounded text-center">Image Portfolio</h1>
            <div>
                <input type="text" name="filename" placeholder="Filename" onChange={handleInputChange} />
                <input type="number" name="size" placeholder="Size" onChange={handleInputChange} />
                <input type="text" name="type" placeholder="Type" onChange={handleInputChange} />
                <input type="text" name="location" placeholder="Location" onChange={handleInputChange} />
                <button onClick={createImage}>Create Image</button>
            </div>
            <div className="graylogo col-md-9 mx-auto rounded mt-5 p-5" >
                <h2 className="mx-auto rounded text-center">All Images</h2>
                <ul>
                    {images.map(image => (
                        <li key={image.id}>
                            <p>{image.filename}</p>
                            <p>{image.size} bytes</p>
                            <p>{image.type}</p>
                            <p>{image.location}</p>
                            <Button 
                                variant="success"
                                onClick={() => getImageById(image.id)}>View</Button>
                            <Button onClick={() => updateImage(image.id)}>Update</Button>
                            <Button onClick={() => deleteImage(image.id)}>Delete</Button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FetchPortfolio;