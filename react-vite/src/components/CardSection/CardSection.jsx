import './CardSection.css'



export default function CardSection({cardSec}) {
  // console.log(cardSec)


  if (!cardSec) return <>Loading</>

  return (
    <div>
      <p>{cardSec?.title}</p>

      <div className='card-section-cards'>
        
      </div>
    </div>
  )
}