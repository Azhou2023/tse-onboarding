import React, { useState } from "react";
import { createTask, updateTask, type Task } from "src/api/tasks";
import { Button, TextField } from "src/components";
import styles from "src/components/TaskForm.module.css";

export interface TaskFormProps {
  mode: "create" | "edit";
  task?: Task;
  onSubmit?: (task: Task) => void;
}

/**
 * A simple way to handle error states in the form. We'll keep a
 * `TaskFormErrors` object in the form's state, initially empty. Before we
 * submit a request, we'll check each field for problems. For each invalid
 * field, we set the corresponding field in the errors object to true, and the
 * corresponding input component will show its error state if the field is true.
 * Look at where the `errors` object appears below for demonstration.
 *
 * In the MVP, the only possible error in this form is that the title is blank,
 * so this is slightly overengineered. However, a more complex form would need
 * a similar system.
 */
interface TaskFormErrors {
  title?: boolean;
}

/**
 * The form that creates or edits a Task object. In the MVP, this is only
 * capable of creating Tasks.
 *
 * @param props.mode Controls how the form renders and submits
 * @param props.task Optional initial data to populate the form with (such as
 * when we're editing an existing task)
 * @param props.onSubmit Optional callback to run after the user submits the
 * form and the request succeeds
 */
export function TaskForm({ mode, task, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState<string>(task?.title || "");
  const [description, setDescription] = useState<string>(task?.description || "");
  const [assignee, setAssignee] = useState(task?.assignee?._id || "");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<TaskFormErrors>({});

  const handleSubmit = () => {
    // first, do any validation that we can on the frontend
    setErrors({});
    if (title.length === 0) {
      setErrors({ title: true });
      return;
    }
    setLoading(true);

    console.log(assignee);
    if (mode === "create") {
      createTask({
        title: title,
        description: description,
        assignee: assignee == "" ? undefined : assignee,
      }).then((result) => {
        if (result.success) {
          setTitle("");
          setDescription("");
          setAssignee("");

          onSubmit && onSubmit(result.data);
        } else {
          alert(result.error);
        }
        setLoading(false);
      });
    } else {
      updateTask({
        ...(task as Task),
        title: title,
        description: description,
        assignee: assignee == "" ? undefined : assignee,
      }).then((result) => {
        if (result.success) {
          onSubmit && onSubmit(result.data);
        } else {
          alert(result.error);
        }
        setLoading(false);
      });
    }
  };

  const formTitle = mode === "create" ? "New task" : "Edit task";

  return (
    <form className={styles.form}>
      {/* we could just use a `<div>` element because we don't need the special
      functionality that browsers give to `<form>` elements, but using `<form>`
      is better for accessibility because it's more accurate for this purpose--
      we are making a form, so we should use `<form>` */}
      <span className={styles.formTitle}>{formTitle}</span>
      <div className={styles.formRow}>
        {/* `data-testid` is used by React Testing Library--see the tests in
        `TaskForm.test.tsx` */}
        <TextField
          className={styles.textField}
          data-testid="task-title-input"
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={errors.title}
        />
        <TextField
          className={`${styles.textField} ${styles.stretch}`}
          data-testid="task-description-input"
          label="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className={styles.formRow}>
        <TextField
          className={styles.textField}
          label="Assignee ID (optional)"
          value={assignee}
          onChange={(event) => setAssignee(event.target.value)}
          error={errors.title}
        />
        <Button
          kind="primary"
          type="button"
          data-testid="task-save-button"
          label="Save"
          disabled={isLoading}
          onClick={handleSubmit}
        />
      </div>
      {/* <TaskList title="All tasks" update={isLoading} /> */}
    </form>
  );
}
