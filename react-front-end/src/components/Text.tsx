function MonoStyleText(props: {style: string, content: string}) {
    return <p className={"font-mono " + props.style}>{props.content}</p>;
}

export { MonoStyleText };