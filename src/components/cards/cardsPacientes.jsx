export default function CardPacientes (props) {
    const {nombre, primerApellido, segundoApellido, img, funcion} = props;

    return (
        <div className="card_recomendados mx-auto"
            onClick={funcion}
        >
            <img className='card_img' src={img}  />
            <div className="card_pie">
                <p className='text-color text-about'>
                    {nombre} {primerApellido} {segundoApellido}
                </p>
            </div>
        </div>
    )
}