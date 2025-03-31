function MonoStyleText(props: {style: string, content: string}) {
    return <p className={"font-mono whitespace-pre-line break-all " + props.style}>{props.content}</p>;
}

export { MonoStyleText };