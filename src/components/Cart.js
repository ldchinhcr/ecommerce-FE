const getCart = async() => {
    try {
    const options = {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    }
    const responseJson = await fetch(process.env.REACT_APP_SERVER + '/cart', options);
    const response = await responseJson.json();
    if (response.status === true) {
        return response.data;
    }
} catch (err) {
    console.log("This account currently doesn't have items in cart")
}
}

export default getCart;