function ImageBrief (props: {
    id?: string,
    src: string,
    style: string
}) {
    return (
        <img id={props.id != undefined ? props.id : crypto.randomUUID()} src={props.src} alt="Image Missed or Broken" className={props.style} />
    )
}

export default ImageBrief;