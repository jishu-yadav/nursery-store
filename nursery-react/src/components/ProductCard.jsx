export default function ProductCard({ product, onView, onAdd, onContact }) {
  return (
    <article className="product-card">
      <img className="product-image" src={product.image} alt={product.name} />
      
      <div className="product-body">
        <h4>{product.name}</h4>
        <p>{product.category}</p>
        <p>${product.price}</p>

        <div className="card-actions">
          <button onClick={() => onView(product)}>View</button>
          <button onClick={() => onAdd(product)}>Add</button>
        </div>

        <button onClick={() => onContact(product)}>
          Contact
        </button>
      </div>
    </article>
  )
}