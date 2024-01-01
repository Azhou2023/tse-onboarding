import React, { useEffect, useState } from "react";
import { getTask, type Task } from "src/api/tasks";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Page, Button } from "src/components";
import styles from "src/pages/TaskDetail.module.css";

export function TaskDetail() {
  const [task, setTask] = useState<Task>({} as Task);
  const [isValid, setValid] = useState<boolean>(true);
  const { id } = useParams();

  useEffect(() => {
    getTask(id as string).then((result) => {
      if (result.success) {
        setTask(result.data);
        setValid(true);
      } else {
        setValid(false);
      }
    });
  }, [id]);

  return (
    <Page>
      <Helmet>
        <title>{task.title + " | TSE Todos"}</title>
      </Helmet>
      <Link to="/">Back to home</Link>
      <br /> <br /> <br />
      {!isValid ? (
        <div className={styles.title}> This task doesn&apos;t exist! </div>
      ) : (
        <div className={styles.items}>
          <div className={styles.firstRow}>
            <span className={styles.title}>{task.title}</span>
            <Button kind="primary" type="button" label="Edit task"></Button>
          </div>
          <div>{task.description == "" ? "(No description)" : task.description}</div>
          <div className={styles.labelRows}>
            <span className={styles.label}>Assignee </span>
            {typeof task.assignee?._id === "undefined" ? (
              <span>Not Assigned</span>
            ) : (
              <div className={styles.assignee}>
                <img className={styles.image} height="30px" width="30px" src="/user-icon.png" />
                <span>{task.assignee.name}</span>
              </div>
            )}
          </div>
          <div className={styles.labelRows}>
            <span className={styles.label}>Status</span>
            <span>{task.isChecked ? "Done" : "Not done"}</span>
          </div>
          <div className={styles.labelRows}>
            <span className={styles.label}>Date created</span>
            <span>
              {new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short" }).format(
                task.dateCreated,
              )}
            </span>
          </div>
        </div>
      )}
    </Page>
  );
}
