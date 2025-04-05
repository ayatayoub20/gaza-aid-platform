const errDisplay = ({ responseJSON }) => {
    const message = responseJSON.message
    if (message.constructor == Array) {
        return message.map((msg)=>`${msg}`).join(' , ')
    }
    return message
}


const getIfUserAccessControlGranted = async (resource, action) => {
    const res = await fetch(`/utils/user/role/can/get?resource=${resource}&action=${action}`)
    return await res.json()
}

