export default function InputLabel({ value, className = '', children, ...props }) {
    return (
        <label {...props} className={className}>
            {value ? value : children}
        </label>
    );
}
