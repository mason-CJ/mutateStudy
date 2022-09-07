import "./styles.css";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import uuid from "react-uuid";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function App() {
  // const { mutate } = useSWRConfig();
  const { data, error, mutate } = useSWR(
    "https://dummyjson.com/products/1",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  console.log("????", data);

  const handleMutate = async () => {
    if (!data) return;
    console.log("mutate");
    const sdf = await axios.get("https://dummyjson.com/products/2");
    const newTitle = sdf.data.title;
    const newDedc = sdf.data.description;
    const newDiscount = sdf.data.discountPercentage;
    console.log(newTitle);

    await mutate(
      {
        ...data,
        title: newTitle,
        description: newDedc,
        discountPercentage: newDiscount
      },
      {
        rollbackOnError: true,
        revalidate: false
      }
    );

    // await axios
    //   .put("https://dummyjson.com/products/1", {
    //     title: newTitle,
    //     description: newDedc,
    //     discountPercentage: newDiscount
    //   })
    //   .then((res) => console.log("Update data", res.data));
  };

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div className="App">
      <h1>Products</h1>
      <button onClick={handleMutate}>Update</button>
      {/* <ul>
        {data.products.map((item) => {
          return <li>{item.title}</li>;
        })}
      </ul> */}

      <p>Title: {data.title}</p>
      <p>Desc: {data.description}</p>
      <p>Discount: {data.discountPercentage}%</p>
    </div>
  );
}
