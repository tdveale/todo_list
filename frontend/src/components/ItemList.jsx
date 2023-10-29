import { format } from "date-fns";
import styles from '../styles/ItemList.module.css'
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import Typography from '@mui/joy/Typography';
import ButtonGroup from '@mui/joy/ButtonGroup';
import CardOverflow from '@mui/joy/CardOverflow';
import DeleteForever from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';
import UpdateButtonModal from './UpdateButtonModal';
import { useState } from 'react';

function ItemList(props) {
  const [currUpdateItem, setCurrUpdateItem] = useState(null);

  const sortItems = (a, b) => {
    const aDate = a?.updated_at ? new Date(a.updated_at) : new Date(a.created_at);
    const bDate = b?.updated_at ? new Date(b?.updated_at) : new Date(b?.created_at);
    return bDate - aDate;
  }

  const onUpdateButtonClick = (item) => {
    setCurrUpdateItem(item);
  }
  
  const onDeleteItem = (id) => {
    fetch(`${props.apiBaseURL}/todo_items/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    }).then(res => {
      if (res.status !== 200) {
        toast.error(`Unable to delete the item! Error: ${res.statusText}`);
        return;
      }
      // Remove the item from the list
      props.onDeleteItem(id);
      toast.success(`Item deleted successfully`);
    })
  }

  const displayItemList = () => {
    if (props.itemList.length === 0) {
      return;
    }

    return (
      props.itemList.sort(sortItems).map(item => (
        <Card
          key={item.id}
          variant="outlined"
          sx={{
            overflow: 'auto',
            // to make the card resizable
            // resize: 'horizontal',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
          </Box>
          <CardContent>
            <Typography level="title-lg">{ item.title }</Typography>
            <Typography level="body-xs">
            {
              item.updated_at ?
              `Updated at: ${ format(new Date(item.updated_at), "ccc dd MMM yyyy HH:mm") }`
              :
              `Created at: ${ format(new Date(item.created_at), "ccc dd MMM yyyy HH:mm") }`
            }
            </Typography>
            <Typography level="body-sm" my={2}>
              { item.details }
            </Typography>
          </CardContent>
          <CardOverflow sx={{ bgcolor: '#fff' }}>
            <CardActions buttonFlex="1">
              <ButtonGroup variant="outlined" sx={{ bgcolor: 'background.surface' }}>
                <UpdateButtonModal 
                  currUpdateItem={currUpdateItem} 
                  item={item} 
                  onButtonClick={onUpdateButtonClick}
                  onItemUpdated={props.onItemUpdated} 
                  apiBaseURL={props.apiBaseURL}
                />
                <Button variant="plain" color="danger" size="sm" onClick={() => onDeleteItem(item.id)}>
                  <DeleteForever /> Delete
                </Button>
              </ButtonGroup>
            </CardActions>
          </CardOverflow>
        </Card>
      ))
    )
  }

  return (
    <div className={styles.listWrapper}>
      <h3 style={{width: '100%'}}>You have {props.itemList.length} to-do items!</h3>
      { displayItemList() }
    </div>
  )
}

export default ItemList;