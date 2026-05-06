import { AccordionComponent } from "../../../components/ui/accordion";


function RepHomePage() {
  const accordionItems = [
    {
      title: "Livraison — Vente - Stock —|— Categorie : Primaire",
      content: "",
    },
  ];
  return (
    <div className="HomePage px-5">
      <AccordionComponent AccordionItems={accordionItems} id="home" allowMultiple={true} />
    </div>
  );
}

export default RepHomePage;
