import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea/Textarea';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Edit from '@mui/icons-material/Edit';
import Typography from '@mui/joy/Typography';
import ButtonGroup from '@mui/joy/ButtonGroup';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function UpdateButtonModal(props) {
  const [open, setOpen] = React.useState(false);
  const [currItem, setCurrItem] = React.useState(null);

  useEffect(() => {
    if (props.item) {
      setCurrItem(props.item);
    }
  }, [props.item])

  const onUpdateButtonClick = () => {
    setOpen(true);
    props.onButtonClick(props.item);
  }

  const onSubmit = (event) => {
    event.preventDefault();
    fetch(`${props.apiBaseURL}/todo_items/${currItem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: currItem.title,
        details: currItem.details
      })
    }).then((res) => {
      if (res.status !== 200) {
        toast.error(`Unable to update the item! Error: ${res.statusText}`);
        return;
      }
      toast.success('Updated item successfully!');
      props.onItemUpdated(currItem);
      setOpen(false);
    })
  }

  return (
    <React.Fragment>
      <Button
        variant="plain" 
        color="primary" 
        size="sm"
        startDecorator={<Edit />}
        onClick={() => onUpdateButtonClick()}
      >
        Update
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="update-to-do-item"
          aria-describedby="update-to-do-item-title-description"
          sx={{ maxWidth: 700, padding: '20px', minWidth: '70vw' }}
        >
          <Typography id="update-modal-dialog-title" level="h3">
            Update Item { props.item.id }
          </Typography>
          <Typography id="update-modal-dialog-description" mb={4}>
            Modify existing todo item.
          </Typography>
          <form
            onSubmit={onSubmit}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input 
                  autoFocus 
                  required 
                  value={currItem?.title || ''}
                  color="primary" 
                  variant="soft" 
                  onChange={(event) => setCurrItem({...currItem, title: event.target.value})}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Details</FormLabel>
                <Textarea
                  minRows={3}
                  color="primary" 
                  variant="soft"
                  placeholder="Type details here"
                  size="md"
                  value={currItem?.details || ''} 
                  onChange={(event) => setCurrItem({...currItem, details: event.target.value})}
                />
              </FormControl>
              <ButtonGroup buttonFlex="1" variant="outlined" sx={{ bgcolor: 'background.surface' }}>
                <Button type="button" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" color="primary" variant="solid">Submit</Button>
              </ButtonGroup>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

export default UpdateButtonModal;