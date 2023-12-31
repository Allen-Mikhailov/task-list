function getLastId(path)
{
    const driveSplit = path.split(":")
    const namesSplit = driveSplit[1].split("/")
    return namesSplit[namesSplit.length-1]
}

function popId(path)
{
    const driveSplit = path.split(":")
    return driveSplit[0]+":"+driveSplit[1].substring(0, driveSplit[1].lastIndexOf("/"))
}

function getDrive(path)
{
    return getFullDrive(path).split(".")[0]
}

function getFullDrive(path)
{
    return path.split(":")[0]
}

function convertToLightPath(path)
{
    const lightPath = []
    const split = path.split("/")
    for (let i = 3; i < split.length; i+=2)
    {   
        lightPath.push(split[i])
    }
    return lightPath
}

function getFrameId(path)
{
    const split = path.split("/")
    return split[1]
}

function getFramePath(path)
{
    return getFullDrive(path)+":"+"frames/"+getFrameId(path)
}

export {getDrive, popId, getLastId, convertToLightPath, getFrameId, getFullDrive, getFramePath}

const base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-"
function createId(checkTable)
{
    let id = ""
    for (let i = 0; i < 20; i++)
    {
        id += base64.charAt(Math.floor(Math.random()*64))
    }

    if (checkTable[id])
        return createId(checkTable)
    return id
}

export { createId, base64 }