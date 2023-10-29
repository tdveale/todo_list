import React, { useMemo, useState } from 'react';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';
import Button from '@mui/joy/Button';
import styles from '../styles/AddItem.module.css'
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';

function AddItem(props) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');


  const titleChangeHandler = (event) => {
    setTitle(event.target.value);
  }

  const detailsChangeHandler = (event) => {
    setDetails(event.target.value);
  }

  const debouncedTitleHandler = useMemo(
    () => debounce(titleChangeHandler, 700),
    []
  )

  const debouncedDetailsHandler = useMemo(
    () => debounce(detailsChangeHandler, 700),
    []
  )

  async function submit() {
    if (!title) {
      toast.error("The title cannot be empty!")
      return;
    }

    await fetch(`${props.apiBaseURL}/todo_items/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        details: details
      })
    }).then((res) => {
      if (res.status !== 200) {
        toast.error(`Unable to add the item! Error: ${res.statusText}`);
        return;
      }
      res.json().then(data => {
        props.onAddItem(data);
      })
      toast.success("The item was successfully added!");
      document.getElementById('title').value = '';
      document.querySelector('[data-field="details"]').children[0].value = '';
    })
    .catch((err) => {
      console.error(err)
      toast.error("Internal server error. Unable to add the item!")
    })
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Add new To-do Item</h2>
      <h3 className={styles.inputTitle}>Title</h3>
      <Input 
        id="title"
        color="primary" 
        variant="soft" 
        placeholder='Type title here' 
        onChange={debouncedTitleHandler}
      />
      <h3 className={styles.inputTitle}>Details</h3>
      <Textarea
        data-field="details"
        minRows={3}
        color="primary" 
        variant="soft"
        placeholder="Type details here"
        size="md"
        onChange={debouncedDetailsHandler}
      />
      <Button 
        className={styles.submitBtn} 
        size="lg" 
        onClick={() => submit()}
      >
        Add item
      </Button>
    </div>
  );
}

export default AddItem;
