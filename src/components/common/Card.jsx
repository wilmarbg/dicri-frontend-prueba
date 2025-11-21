const Card = ({ children, title, subtitle, actions }) => {
    return (
        <div className="card">
            {(title || actions) && (
                <div className="flex justify-between items-start mb-4">
                    <div>
                        {title && <h3 className="text-xl font-semibold text-gray-900">{title}</h3>}
                        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                    </div>
                    {actions && <div className="flex gap-2">{actions}</div>}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;