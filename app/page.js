"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Button,
  Modal,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  collection,
  count,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  where,
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setitemName] = useState("");
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [inventoryCopy, setInventoryCopy ] = useState([]);

  async function searchItem(value){
    const inventoryList = [];

    //if there is something in the input box
    if(value.length){
      const searchQuery = query(collection(firestore, "inventory"), where('__name__', '==', value));
      const searchDocs = await getDocs(searchQuery)
      searchDocs.forEach( doc => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      })
      setInventory(inventoryList);
      setItemCount(inventoryList.length);
    }else{ //if there's nothing in the input box
      setInventory(inventoryCopy);
    }
  }
  const updateInventory = async () => {
    console.log("updateInventory triggered");
    setLoading(true);
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    console.log("docs: ", docs);
    setLoading(false);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    console.log(inventoryList.length);
    setInventory(inventoryList);
    setInventoryCopy(inventoryList);
    setItemCount(inventoryList.length);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setitemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setitemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
      >
        Add New Item
      </Button>
      <Box border="1p solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                sx={{ bgcolor: "grey.900" }}
                width="800px"
                height="100px"
              />
            ) : (
              `Inventory List: ${itemCount}`
            )}
          </Typography>
        </Box>
        <Box>
          <input name="searchItems" onChange={(e) => {
            let value = e.target.value;
            searchItem(value);
          }} />
        </Box>
        <Stack width="800px" height="800px" spacing={2} overflow="auto">
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(name);
                  }}
                >
                  {" "}
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    removeItem(name);
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}

          {isLoading ? <Skeleton variant="rectangular" height={150} /> : ""}
        </Stack>
      </Box>
    </Box>
  );
}
