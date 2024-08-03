"use client";
import { useState, useEffect, useRef } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "./firebase";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ImageIcon from '@mui/icons-material/Image';
import Image from 'next/image';


export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const fileInputRef = useRef(null);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({
        id: doc.id,
        name: doc.id,
        ...doc.data(),
      });
    });
    setPantry(pantryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);

    let imageUrl = null;
    if (itemImage) {
      const storageRef = ref(storage, `product-images/${item}`);
      await uploadBytes(storageRef, itemImage);
      imageUrl = await getDownloadURL(storageRef);
    }

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await updateDoc(docRef, { 
        quantity: quantity + 1,
        imageUrl: imageUrl || docSnap.data().imageUrl
      });
    } else {
      await setDoc(docRef, { 
        quantity: 1,
        imageUrl: imageUrl
      });
    }

    await updatePantry();
    setItemImage(null);
  };

  const updateItemQuantity = async (itemId, increment) => {
    const docRef = doc(collection(firestore, "pantry"), itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      const newQuantity = quantity + increment;
      
      if (newQuantity > 0) {
        await updateDoc(docRef, { quantity: newQuantity });
      } else {
        await deleteDoc(docRef);
      }
      
      await updatePantry();
    }
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemName("");
    setItemImage(null);
  };

  const handleImageUpload = (event) => {
    if (event.target.files[0]) {
      setItemImage(event.target.files[0]);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/pantry-f15b6.appspot.com/o/product-images%2Fpexels-semiha-643347578-25186434.jpg?alt=media&token=d7c0fb4e-e2f8-4911-a34b-a40743c940a4')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="h2" gutterBottom align="center" color="brown">
            Pantryfront
          </Typography>
          <Button
            style={{ backgroundColor: "#A21E02" }}
            variant="contained"
            onClick={handleOpen}
            sx={{ mb: 3 }}
          >
            Add New Item
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pantry.map(({ id, name, quantity, imageUrl }) => (
                  <TableRow key={id}>
                    <TableCell component="th" scope="row">
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </TableCell>
                    <TableCell>
                      {imageUrl && (
                        <Image src={imageUrl} alt={name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                      )}
                    </TableCell>
                    <TableCell align="right">{quantity}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => updateItemQuantity(id, 1)}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => updateItemQuantity(id, -1)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Add Item
          </Typography>
          <TextField
            label="Item Name"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <Button
            variant="outlined"
            startIcon={<ImageIcon />}
            onClick={() => fileInputRef.current.click()}
            sx={{ mb: 2 }}
          >
            {itemImage ? 'Change Image' : 'Upload Image'}
          </Button>
          {itemImage && <Typography variant="body2">Image selected: {itemImage.name}</Typography>}
          <br/>
          <Button
          style={{ backgroundColor: "#A21E02" }}
            variant="contained"
            onClick={() => {
              if (itemName.trim()) {
                addItem(itemName.trim());
                handleClose();
              }
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}