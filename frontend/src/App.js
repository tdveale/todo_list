import logo from './assets/logo.svg';
import './styles/App.css';
import AddItem from './components/AddItem';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { useEffect } from 'react';
import LinearProgress from '@mui/joy/LinearProgress';
import ItemList from './components/ItemList';


function App() {
  const apiBaseURL = "http://localhost:8000"; 
  const [loading, setLoading] = useState(false);
  const [itemList, setItemList] = useState([]);


  useEffect(() => {
    fetchItems();
  }, [])

  const fetchItems = () => {
    setLoading(true);
    fetch (`${apiBaseURL}/todo_items/?skip=0&limit=100`, {
      "method": "GET",
      headers: { "Content-Type": "application/json" },
    }).then(res => res.json())
    .then((data) => {
      setItemList(data);
    }).catch((err) => {

    })
    .finally(() => {
      setLoading(false);
    })
  }

  const onDeleteItem = (id) => {
    const itemIdx = itemList.findIndex(i => i.id === id);

    if (!itemIdx) {
      toast.warning('Cannot sync the item, you might need to refresh the page to view the changes.');
      return;
    }

    setItemList([...itemList.splice(itemIdx, 1)])
  }

  const onAddItem = (item) => {
    setItemList([...itemList, item]);
  }

  const onItemUpdated = (item) => {
    const itemIdx = itemList.findIndex(i => i.id === item.id);

    if (!itemIdx) {
      toast.warning('Cannot sync the item, you might need to refresh the page to view the changes.');
      return;
    }

    setItemList([...itemList.splice(itemIdx, 1), item])
  }

  const displayItemList = () => {
    if (loading) {
      return (
        <div className='App-item-list-loading'>
          <LinearProgress
            color="primary"
            determinate={false}
            size="lg"
            value={40}
            variant="soft"
          />
          <p>Loading items...</p>
        </div>

      )
    }

    return (
      <ItemList 
        apiBaseURL={apiBaseURL} 
        itemList={itemList} 
        onDeleteItem={onDeleteItem} 
        onItemUpdated={onItemUpdated}
      />
    )
  }

  return (
    <>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      
      <ToastContainer theme="light" position='top-center' />
      
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>A simple To-do App</h2>
        </header>
        <AddItem apiBaseURL={apiBaseURL} onAddItem={onAddItem} />
      </div>
      
      <div className='App-item-list-container'>
        {displayItemList()}
      </div>
    </>

  );
}

export default App;
