document.addEventListener("DOMContentLoaded", () => {
    fetchData()
})



const fetchData = async() => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        // console.log(data)
        mostrarProductos(data)
        detectarBotones(data)
        
    } catch (error) {
        console.log(error)
    }
}

const contenedorProductos = document.querySelector('#contenedor-productos')

const mostrarProductos = (data) =>{
    
    const template = document.querySelector('#template-productos').content
    const fragment = document.createDocumentFragment()
    // console.log(template)
    data.forEach(producto => {
    // console.log(producto)
    template.querySelector('img').setAttribute('src', producto.image)
    template.querySelector('h5').textContent = producto.titulo
    template.querySelector('.card-text').textContent = producto.precio
    template.querySelector('button').dataset.id =producto.id

    const clone = template.cloneNode(true)
        fragment.appendChild(clone)
})

contenedorProductos.appendChild(fragment)
}

let carrito = {}

const detectarBotones = (data) =>{
    const botones = document.querySelectorAll('.card button')

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            // console.log(btn.dataset.id)
            const producto = data.find(item => item.id === parseInt(btn.dataset.id))
            
            producto.cantidad = 1

            // si ya esta en el carrito, aumento la cantidad
            if(carrito.hasOwnProperty(producto.id)){
                producto.cantidad = carrito[producto.id].cantidad + 1
            }

            // indico el indice y agrego el elemento al carrito
            carrito[producto.id] = {...producto}
            // console.log(carrito)
            productosEnCarrito()
        })
    })
}

const items = document.querySelector('#items')

const productosEnCarrito = () =>{

    const fragment = document.createDocumentFragment()
    const template = document.querySelector('#template-carrito').content

    
    items.innerHTML = ''

    Object.values(carrito).forEach(producto =>{
        // console.log(carrito)
        template.querySelector('th').textContent = producto.id
        template.querySelectorAll('td')[0].textContent = producto.titulo
        template.querySelectorAll('td')[1].textContent = producto.cantidad
        template.querySelector('span').textContent = producto.precio * producto.cantidad
        
        // botones + , -
        template.querySelector('.btn-info').dataset.id = producto.id
        template.querySelector('.btn-danger').dataset.id = producto.id

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    muestroFooter()
    btnAumentarDisminuir()
}

const footer = document.querySelector('#footer-carrito')
const muestroFooter = () =>{

    footer.innerHTML = ''

    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5">El Carrito está vacío!</th>
        `
        return
    }

const template = document.querySelector('#template-footer').content
const fragment = document.createDocumentFragment()

// sumo cantidad y sumo totales
//convierto la coleccion de objetos en array (Object.values(carrito))
    const nCantidad = Object.values(carrito).reduce((acumulador, { cantidad }) => acumulador + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acumulador, {cantidad, precio}) => acumulador + cantidad * precio ,0)
    // console.log(nPrecio)


    template.querySelectorAll('td')[0].textContent = nCantidad
    template.querySelector('span').textContent = nPrecio

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        productosEnCarrito()
        
    })
}

const btnAumentarDisminuir = () =>{
    const botonesAgregar = document.querySelectorAll('#items .btn-info')
    const botonesEliminar = document.querySelectorAll('#items .btn-danger')

    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', () =>{
        // console.log('agregando....')
       const producto = carrito[btn.dataset.id]
       producto.cantidad ++
       carrito[btn.dataset.id] = {...producto}
       productosEnCarrito()
        })
    })

    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', () =>{
            // console.log('eliminando....')
        const producto = carrito[btn.dataset.id]
        producto.cantidad --
        if(producto.cantidad === 0){
            delete carrito[btn.dataset.id]
        }else{
            carrito[btn.dataset.id] = {...producto}
            
        }
        productosEnCarrito()

        })
    })
}