provider "aws" {
  region = "eu-west-1"
}

resource "aws_instance" "webapp" {
  ami           = "ami-0fa8fe6f147dc938b"
  instance_type = "t2.micro"
  key_name      = "mykey"
  subnet_id     = "subnet-035e74a88a53b93ce"

  vpc_security_group_ids = [
    aws_security_group.webapp_sg.id,
  ]

  tags = {
    "Name" = "Preventi-Diabete"
  }

  root_block_device {
    delete_on_termination = true
    volume_size           = 8
    volume_type           = "gp3"
  }
}


# aws_security_group.webapp_sg:
resource "aws_security_group" "webapp_sg" {
  name   = "preventi-diabete-sg-prod"
  vpc_id = "vpc-0f8195d6dbc62a8d4"

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["196.117.69.192/32"]
    description = "Frontend"
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["196.117.69.192/32"]
    description = "Jenkins"
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["196.117.69.192/32"]
    description = "SSH"
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["108.129.87.235/32", "196.117.69.192/32"]
    description = "Frontend call Backend"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
