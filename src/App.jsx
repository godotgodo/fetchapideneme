import React, { useEffect } from "react";
import { useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useAutoAnimate } from '@formkit/auto-animate/react'


const url = 'http://localhost:3005/todos';

//modalstyle
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'darkgray',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '1rem'
};

function App() {
  const [datam, setDatam] = useState([]);
  const [newData, setNewData] = useState('');
  const [editNewData, setEditNewData] = useState('');
  const [parent] = useAutoAnimate();


  //addmodal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //editmodal
  const [editopen, seteditOpen] = useState(false);
  const handleeditOpen = () => seteditOpen(true);
  const handleeditClose = () => seteditOpen(false);

  const addData = () => {
    postData();
  }

  const getData = () => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setDatam(data)
      })
      .catch(err => { console.log(err); })
  }

  const postData = () => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: '',
        text: newData,
        completed: false,
      })
    })
      .then(res => res.json())
      .then(data => {
        setDatam([...datam, data]);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const putData = (e) => {
    console.log(e.target.id);
    fetch(`${url}/${e.target.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: '',
        text: editNewData,
        completed: false
      })
    })
      .then(res => res.json())
      .then(data => {
        getData();
      })
  }

  const deleteData = (e) => {
    console.log(e.target.id);
    fetch(`${url}/${e.target.id}`, {
      method: 'DELETE'
    })
      .then(res => {
        getData();
      })
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <div className="w-full min-h-screen h-full bg-slate-700 p-4 flex flex-col items-center">
      <ul className="w-1/2 mx-auto list-disc" ref={parent}>
        {
          datam.map(data =>
            <li key={data.id} className="text-white text-2xl border rounded border-yellow-500 p-2 mb-2 mt-2 flex justify-between">
              {data.text}
              <Button className="!ml-auto !mr-1 !text-white" id={data.id} onClick={(e) => deleteData(e)}>delete</Button>
              <Button onClick={handleeditOpen} className="!text-white">edit</Button>
              <Modal
                open={editopen}
                onClose={handleeditClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Text in a modal
                  </Typography>
                  <input type="text" onChange={(e)=>setEditNewData(e.target.value)} className="mt-2 p-2 rounded" defaultValue={data.text} />
                  <Button className="!mr-1 !text-white" id={data.id} onClick={e => putData(e)}>
                    edit
                  </Button>
                </Box>
              </Modal>
            </li>
          )
        }
      </ul>
      <Button className="!text-white" onClick={() => {
        handleOpen();
      }}>Add</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add new todo
          </Typography>
          <input type="text" onChange={(e) => setNewData(e.target.value)} className="mt-2 p-2 rounded" placeholder="new todo" />
          <Button onClick={addData}>ekle</Button>
        </Box>
      </Modal>
    </div >
  );
}

export default App;
