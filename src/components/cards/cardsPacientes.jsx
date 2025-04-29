export default function CardPacientes (props) {
    const {nombre, img, funcion} = props;

    return (
        <div className="card_recomendados mx-auto"
            onClick={funcion}
        >
            <img className='card_img' src={img}  />
            <div className="card_pie">
                <p className='text-color text-about'>
                    {nombre}
                </p>
            </div>
        </div>
    )
}