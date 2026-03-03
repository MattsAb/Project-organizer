
type ErrorProps = {
    message: string
}

export default function ErrorComponent ({message}: ErrorProps) {

    return (
    
        <p className="text-red-600 flex justify-center items-center"> {message} </p>
    )
}