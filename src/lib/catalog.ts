export type Product = {id:string;category:'diaper'|'treat';name:string;description:string;quantity:number;priceCents:number};
export const products: Product[] = [
{id:'diaper-p',category:'diaper',name:'Fralda P',description:'Pacote comercial de aproximadamente 72 fraldas. Pampers, Huggies ou Babysec.',quantity:5,priceCents:10000},
{id:'diaper-m',category:'diaper',name:'Fralda M',description:'Pacote comercial de aproximadamente 68 fraldas. Pampers, Huggies ou Babysec.',quantity:18,priceCents:8500},
{id:'diaper-g',category:'diaper',name:'Fralda G',description:'Pacote comercial de aproximadamente 60 fraldas. Pampers, Huggies ou Babysec.',quantity:22,priceCents:9000},
{id:'diaper-xg',category:'diaper',name:'Fralda XG',description:'Pacote comercial de aproximadamente 56 fraldas. Pampers, Huggies ou Babysec.',quantity:18,priceCents:8000},
{id:'diaper-xxg',category:'diaper',name:'Fralda XXG',description:'Pacote comercial de aproximadamente 52 fraldas. Pampers, Huggies ou Babysec.',quantity:7,priceCents:8000},
{id:'treat-wipes',category:'treat',name:'Lenços umedecidos',description:'Pacote com aproximadamente 96 lenços. Huggies, Pampers, Johnson’s, Bepantol Baby ou Personalidade Baby.',quantity:25,priceCents:2800},
{id:'treat-cream',category:'treat',name:'Creme preventivo de assaduras',description:'Bisnaga de 30 g.',quantity:5,priceCents:2700},
{id:'treat-soap',category:'treat',name:'Sabonete líquido infantil',description:'Frasco de 200 ml.',quantity:8,priceCents:3300},
{id:'treat-shampoo',category:'treat',name:'Shampoo infantil',description:'Frasco de 200 ml.',quantity:7,priceCents:2000},
{id:'treat-towel',category:'treat',name:'Toalha com capuz',description:'Uma toalha de algodão, aproximadamente 90 × 70 cm.',quantity:2,priceCents:6000},
{id:'treat-mouthcloth',category:'treat',name:'Fraldinha de boca',description:'Uma unidade avulsa.',quantity:4,priceCents:1500},
{id:'treat-clothdiaper',category:'treat',name:'Fralda de pano',description:'Uma unidade de aproximadamente 70 × 70 cm.',quantity:4,priceCents:2000},
{id:'treat-bib',category:'treat',name:'Babador',description:'Uma unidade.',quantity:4,priceCents:3000},
{id:'treat-blanket',category:'treat',name:'Manta',description:'Uma manta de malha, aproximadamente 90 × 80 cm.',quantity:5,priceCents:6500},
{id:'treat-socks',category:'treat',name:'Kit de meias',description:'Um kit com 3 pares de meias para bebê.',quantity:6,priceCents:3000}
];
export const event = {name:'Matteo',date:'2027-03-20T15:00:00-03:00',dateConfirmed:false,address:'Alameda das Acácias, 100 — Pouso Alegre, MG, 37550-000. Salão de festas ao lado da portaria do condomínio.',coordinates:{lat:-22.306887,lng:-45.914635}};
export const pixKey = '4c6c9111-67a5-4542-8f5f-ebce6e0cb3f8';
export const giftMessage = `A chegada do Matteo está enchendo nossos corações de alegria e também nossa casinha de novos sonhos.

Estamos preparando cada detalhe com muito amor para recebê-lo: as primeiras roupinhas, as fraldinhas, os produtos de higiene, os brinquedos e tudo o que fará parte dos seus primeiros momentos de vida.

Além do chá do Matteo, também estamos montando nosso novo lar, onde viveremos tantos momentos especiais em família. Cada presente representa um gesto de carinho que nos acompanhará nessa nova etapa da vida. Seja um item para o Matteo, um presente para o nosso lar ou uma contribuição em valor livre, tudo será recebido com muito amor e fará parte da nossa história.

O mais importante é celebrar esse momento ao lado de pessoas tão especiais como você.`;
