function Button ({ className, onClick, children, disabled = false }) {
    return(
        <button className={className} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}

export default Button;