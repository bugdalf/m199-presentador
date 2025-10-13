export default function Rhema({rhema, rhemaQuote}: {rhema: string, rhemaQuote: string}) {
  return (
    <div>
      <p className="font-bold text-sm text-amber-500">"{rhema}"</p>
      <p className="text-xs italic">{rhemaQuote}</p>
    </div>
  )
}