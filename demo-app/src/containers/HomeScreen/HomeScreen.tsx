import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ITask } from '../../openapi/api';
import { getTaskList } from '../../services/axiosService';
import { isAuth, removeAuthToken } from '../../utils/authManager';

const HomeScreen = () => {
  let navigate = useNavigate();

  const [taskList, setTaskList] = useState<ITask[]>([]);

  const handleSubmit = async (event: any) => {
    removeAuthToken();
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    const setTasks = async () => {
      const hasJwtToken = isAuth();
      if(hasJwtToken){
        navigate("/", { replace: true });
      }
      const taskList: ITask[] | string = await getTaskList();
      if (typeof taskList !== 'string' && hasJwtToken) {
        setTaskList(taskList);
      } else {
        // removeAuthToken();
        // navigate("/login", { replace: true });
      }
    }
    setTasks();
  }, [])
  return (
    <div>
      <label>Hello to homescreen</label>
      <div>
        {taskList.map((item: ITask, index: number) => (
          <div key={index}>
            <h2>Name: {item.name}</h2>
            <h2>Description: {item.description}</h2>
            <h2>Due Date: {item.dueDate}</h2>
            <h2>Status: {item.status}</h2>
          </div>
        ))}
      </div>
      <Link to="/register">Register</Link>
      <button onClick={handleSubmit}>
        Logout
      </button>
    </div>
  );
}

export default HomeScreen;